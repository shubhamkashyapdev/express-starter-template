import type { GetServerSideProps, NextPage } from 'next';
import useSWR from 'swr';
import styles from '../styles/Home.module.css';
import fetcher from '../utils/fetcher';
import cookies from 'next-cookies';

interface User {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const Home: NextPage<{ fallbackData: User }> = ({ fallbackData }) => {
  const { data, error } = useSWR<User>(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    fetcher,
    { fallbackData },
  );

  const isLoggedIn = () => {
    if (data) {
      return <h1>User is loggied In {JSON.stringify(data.name)}</h1>;
    } else {
      return <h1>Please Login...</h1>;
    }
  };
  return <div className={styles.container}>{isLoggedIn()}</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await fetcher(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    context.req.headers,
  );
  return {
    props: { fallbackData: data || {} },
  };
};

export default Home;
