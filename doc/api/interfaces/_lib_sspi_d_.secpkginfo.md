[node-expose-sspi](../README.md) › ["lib/sspi.d"](../modules/_lib_sspi_d_.md) › [SecPkgInfo](_lib_sspi_d_.secpkginfo.md)

# Interface: SecPkgInfo

SecPkgInfo is the interface returned by EnumerateSecurityPackages and QuerySecurityPackageInfo
for having info about SSP providers.

When doing SSO, you need to use a SSP provider (ex: Negotiate SSP provider).

**`interface`** SecPkgInfo

## Hierarchy

* **SecPkgInfo**

## Index

### Properties

* [Comment](_lib_sspi_d_.secpkginfo.md#comment)
* [Name](_lib_sspi_d_.secpkginfo.md#name)
* [cbMaxToken](_lib_sspi_d_.secpkginfo.md#cbmaxtoken)
* [fCapabilities](_lib_sspi_d_.secpkginfo.md#fcapabilities)
* [wRPCID](_lib_sspi_d_.secpkginfo.md#wrpcid)
* [wVersion](_lib_sspi_d_.secpkginfo.md#wversion)

## Properties

###  Comment

• **Comment**: *string*

*Defined in [lib/sspi.d.ts:25](https://github.com/jlguenego/node-expose-sspi/blob/41d66b9/lib/sspi.d.ts#L25)*

___

###  Name

• **Name**: *string*

*Defined in [lib/sspi.d.ts:24](https://github.com/jlguenego/node-expose-sspi/blob/41d66b9/lib/sspi.d.ts#L24)*

___

###  cbMaxToken

• **cbMaxToken**: *number*

*Defined in [lib/sspi.d.ts:23](https://github.com/jlguenego/node-expose-sspi/blob/41d66b9/lib/sspi.d.ts#L23)*

___

###  fCapabilities

• **fCapabilities**: *number*

*Defined in [lib/sspi.d.ts:20](https://github.com/jlguenego/node-expose-sspi/blob/41d66b9/lib/sspi.d.ts#L20)*

___

###  wRPCID

• **wRPCID**: *number*

*Defined in [lib/sspi.d.ts:22](https://github.com/jlguenego/node-expose-sspi/blob/41d66b9/lib/sspi.d.ts#L22)*

___

###  wVersion

• **wVersion**: *number*

*Defined in [lib/sspi.d.ts:21](https://github.com/jlguenego/node-expose-sspi/blob/41d66b9/lib/sspi.d.ts#L21)*