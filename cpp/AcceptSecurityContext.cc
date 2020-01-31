#include "misc.h"

namespace myAddon {

Napi::Value e_AcceptSecurityContext(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1) {
    throw Napi::Error::New(env,
                           "AcceptSecurityContext: Wrong number of arguments. "
                           "AcceptSecurityContext({ credential, "
                           "clientSecurityContext, serverContextHandle })");
  }

  Napi::Object input = info[0].As<Napi::Object>();
  CredHandle cred = SecHandleUtil::deserialize(
      input.Get("credential").As<Napi::String>().Utf8Value());
  Napi::Object clientSecurityContext =
      input.Get("clientSecurityContext").As<Napi::Object>();

  PSecBufferDesc pInput = JS::initSecBufferDesc(
      clientSecurityContext.Get("SecBufferDesc").As<Napi::Object>());

  BYTE buffer[cbMaxMessage];
  SecBuffer secBuffer;
  secBuffer.cbBuffer = cbMaxMessage;
  secBuffer.BufferType = SECBUFFER_TOKEN;
  secBuffer.pvBuffer = buffer;

  SecBufferDesc fromServerSecBufferDesc;
  fromServerSecBufferDesc.ulVersion = 0;
  fromServerSecBufferDesc.cBuffers = 1;
  fromServerSecBufferDesc.pBuffers = &secBuffer;

  CtxtHandle serverContextHandle = {0, 0};
  bool isFirstCall = true;
  if (input.Has("serverContextHandle")) {
    isFirstCall = false;
    Napi::String serverContextHandleString =
        input.Get("serverContextHandle").As<Napi::String>();
    serverContextHandle =
        SecHandleUtil::deserialize(serverContextHandleString.Utf8Value());
  }

  ULONG ulServerContextAttr;
  TimeStamp tsExpiry;
  SECURITY_STATUS secStatus = AcceptSecurityContext(
      &cred, isFirstCall ? NULL : &serverContextHandle, pInput,
      ASC_REQ_CONNECTION, SECURITY_NATIVE_DREP, &serverContextHandle,
      &fromServerSecBufferDesc, &ulServerContextAttr, &tsExpiry);

  Napi::Object result = Napi::Object::New(env);
  result["serverContextHandle"] =
      Napi::String::New(env, SecHandleUtil::serialize(serverContextHandle));

  switch (secStatus) {
    case SEC_I_CONTINUE_NEEDED:
      result["SECURITY_STATUS"] =
          Napi::String::New(env, "SEC_I_CONTINUE_NEEDED");
      break;
    case SEC_E_OK:
      result["SECURITY_STATUS"] = Napi::String::New(env, "SEC_E_OK");

      break;
    default:
      result["SECURITY_STATUS"] =
          Napi::String::New(env, plf::string_format("0x%08x", secStatus));
  }
  std::string secStatusStr = plf::string_format("0x%08x", secStatus);
  if (secStatus < 0) {
    switch (secStatus) {
      case SEC_E_INVALID_TOKEN:
        secStatusStr = "SEC_E_INVALID_TOKEN";
        break;
    }
    throw Napi::Error::New(
        env, plf::string_format(
                 "AcceptSecurityContext: SECURITY_STATUS incorrect (<0): %s",
                 secStatusStr.c_str()));
  }
  result["SecBufferDesc"] = JS::convert(env, &fromServerSecBufferDesc);
  isFirstCall = false;

  return result;
}

}  // namespace myAddon
