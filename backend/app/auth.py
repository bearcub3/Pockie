import os
import json
from flask import request, abort
from functools import wraps
from jose import jwt
from urllib.request import urlopen
from decouple import config
import requests

DOMAIN = config('DOMAIN')
ALGORITHMS = config('ALGORITHMS')
API_AUDIENCE = config('API_AUDIENCE')

public_key_cache = {}


'''
AuthError Exception
A standardized way to communicate auth failure modes
'''


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


'''
@DONE implement get_token_auth_header() method
    it should attempt to get the header from the request
        it should raise an AuthError if no header is present
    it should attempt to split bearer and the token
        it should raise an AuthError if the header is malformed
    return the token part of the header
'''


def get_token_auth_header():
    auth = request.headers.get('Authorization', None)
    if not auth:
        raise AuthError({
            'code': 'authorization_header_missing',
            'description': 'Authorization header is expected.'
        }, 401)

    parts = auth.split()

    if parts[0].lower() != 'bearer':
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Authorization header must start with "Bearer".'
        }, 401)

    elif len(parts) == 1:
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Token not found.'
        }, 401)

    elif len(parts) > 2:
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Authorization header must be bearer token.'
        }, 401)

    token = parts[1]
    return token


def check_permission(permission, payload):
    if 'permissions' not in payload:
        abort(400)

    if permission not in payload['permissions']:
        raise AuthError({
            'code': 'unauthorized',
            'description': 'Permission Not allowed'
        }, 401)
    return True


'''
@DONE implement verify_decode_jwt(token) method
    @INPUTS
        token: a json web token (string)
    !!NOTE urlopen has a common certificate error described here:
    https://stackoverflow.com/questions/50236117/scraping-ssl-certificate-verify-failed-error-for-http-en-wikipedia-org
'''


def fetch_jwk_for(token=None):
    if token is None:
        raise NameError('token is required')

    jwks_uri = urlopen(f'https://{DOMAIN}/oauth2/default/v1/keys')
    jwks = json.loads(jwks_uri.read())

    unverified_header = jwt.get_unverified_header(token)
    key_id = None

    if 'kid' in unverified_header:
        key_id = unverified_header['kid']
    else:
        raise ValueError('The id_token header must contain a "kid"')
    if key_id in public_key_cache:
        return public_key_cache[key_id]

    r = requests.get(jwks_uri)
    jwks = r.json()

    for key in jwks['keys']:
        jwk_id = key['kid']
        public_key_cache[jwk_id] = key

    if key_id in public_key_cache:
        return public_key_cache[key_id]
    else:
        raise RuntimeError("Unable to fetch public key from jwks_uri")


def verify_decode_jwt(token):
    jsonurl = urlopen(f'https://{DOMAIN}/oauth2/default/v1/keys')
    jwks = json.loads(jsonurl.read())

    unverified_header = jwt.get_unverified_headers(token)

    # cchoose our key
    rsa_key = {}
    if 'kid' not in unverified_header:
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Authorization malformed.'
        }, 401)

    for key in jwks['keys']:
        if key['kid'] == unverified_header['kid']:
            rsa_key = {
                'kty': key['kty'],
                'kid': key['kid'],
                'use': key['use'],
                'n': key['n'],
                'e': key['e']
            }
    if rsa_key:
        try:
            # use the key to validate the jwt
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=ALGORITHMS,
                audience=API_AUDIENCE,
                issuer='https://' + DOMAIN + '/oauth2/default'
            )

            return payload

        except jwt.ExpiredSignatureError:
            raise AuthError({
                'code': 'token_expired',
                'description': 'Token expired.'
            }, 401)

        except jwt.JWTClaimsError:
            raise AuthError({
                'code': 'invalid_claims',
                'description': 'check the audience and issuer.'
            }, 401)

        except Exception:
            raise AuthError({
                'code': 'invalid_header',
                'description': 'Unable to parse authentication token.'
            }, 400)

    raise AuthError({
        'code': 'invalid_header',
        'description': 'Unable to find the appropriate key.'
    }, 400)


'''
@DONE implement @requires_auth(permission) decorator method
    @INPUTS
        permission: string permission
    return the decorator which passes the decoded payload
    to the decorated method
'''


def requires_auth(permission=''):
    def requires_auth_decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            token = get_token_auth_header()
            payload = verify_decode_jwt(token)
            check_permission(permission, payload)
            return f(payload, *args, **kwargs)

        return wrapper
    return requires_auth_decorator

