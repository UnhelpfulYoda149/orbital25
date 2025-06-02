import "../App.css";
import { supabase } from "../App";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

function LoginPage() {
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={[]}
    />
  );
}

export default LoginPage;
