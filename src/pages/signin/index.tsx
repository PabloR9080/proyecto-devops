import AuthForm from "../../components/Authform";
import Layout from "../../components/Layout";

export default function Signin() {
  return (
    <Layout>
      <AuthForm mode="signin"></AuthForm>
    </Layout>
  );
}
