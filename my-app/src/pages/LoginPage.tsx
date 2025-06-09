import "../App.css";
import { supabase } from "../App";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  supabase.auth.getSession().then((val) => {
    if (val) {
      navigate("/");
    }
  });
  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      providers={[]}
    />
  );
}

export default LoginPage;
