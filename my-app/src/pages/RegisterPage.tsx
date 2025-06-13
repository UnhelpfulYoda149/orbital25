import LoginForm from "../components/LoginForm"


function RegisterPage() {
    return <LoginForm route="/api/user/register/" method="register" />
}

export default RegisterPage;
