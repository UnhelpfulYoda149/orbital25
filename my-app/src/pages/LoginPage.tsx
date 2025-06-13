import LoginForm from "../components/LoginForm"

function LoginPage() {
    return <LoginForm route="/api/token/" method="login" />
}

export default LoginPage
