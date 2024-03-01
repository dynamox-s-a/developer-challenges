import { GetServerSideProps } from "next";

const Page = () => <></>;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: "/auth/login",
      permanent: false,
    },
  };
};

export default Page;

