import SearchIcon from '@mui/icons-material/Search';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Search.module.css';
import parse from 'html-react-parser';

type Response = {
  text: string;
  date: string;
  topic: string;
  url: string;
};

type Suggestion = {
  incr: boolean;
  payload: string;
  score: number;
  term: string;
};

type SearchResult = {
  total: number;
  response: Response[];
  suggestions: Suggestion[];
};

type Props = {
  apiUrl: string;
};

const Home: NextPage<Props> = ({ apiUrl }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult>({
    total: 0,
    response: [],
    suggestions: [],
  });

  useEffect(() => {
    if (searchTerm.length > 0) {
      fetch(`${apiUrl}/api/search/guide/${searchTerm}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => setSearchResults(data))
        .catch((err) => console.log(err));
    }
  }, [apiUrl, searchTerm]);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <div
            className={
              searchTerm.length > 0
                ? styles.searchContainerWithResults
                : styles.searchContainer
            }
          >
            <SearchIcon htmlColor="#72767df9" />
            <input
              title="Search"
              aria-label="Search"
              name="search"
              type="text"
              className={styles.searchBar}
              placeholder="Search a term"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchResults.response && searchResults.response.length > 0 && (
            <ul className={styles.resultsContainer}>
              {searchResults.response.map((result: any, index: number) => (
                <a
                  key={index}
                  target="_blank"
                  href={result.url}
                  className={styles.resultCard}
                  rel="noreferrer"
                >
                  <li className={styles.flexRow}>
                    <p className={styles.resultType}>Jump to: </p>{' '}
                    {parse(result.text)}
                  </li>
                  <li className={styles.flexRow}>
                    <p className={styles.resultType}>Term: </p>{' '}
                    {parse(result.topic)}
                  </li>
                </a>
              ))}
            </ul>
          )}
          {searchTerm.length > 0 && !searchResults.response && (
            <div className={styles.resultsContainer}>No Results Found</div>
          )}
        </div>
      </main>
    </div>
  );
};

export async function getStaticProps() {
  const apiUrl = process.env.API_URL;
  return {
    props: { apiUrl }, // will be passed to the page component as props
  };
}

export default Home;
