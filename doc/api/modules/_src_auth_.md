[node-expose-sspi](../README.md) › ["src/auth"](_src_auth_.md)

# External module: "src/auth"

## Index

### Functions

* [auth](_src_auth_.md#auth)

## Functions

###  auth

▸ **auth**(): *RequestHandler*

*Defined in [src/auth.ts:15](https://github.com/jlguenego/node-expose-sspi/blob/41d66b9/src/auth.ts#L15)*

Tries to get SSO information from browser. If success, the SSO info
is stored under req.sso

**Returns:** *RequestHandler*

a middleware