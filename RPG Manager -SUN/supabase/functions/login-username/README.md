# Login por username

Faça o deploy sem verificação JWT porque o usuário ainda não possui sessão:

```sh
supabase functions deploy login-username --no-verify-jwt
supabase functions deploy register-username --no-verify-jwt
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` ficam somente no ambiente da Edge Function. Nunca copie a service role para o Vite ou para a Vercel.
