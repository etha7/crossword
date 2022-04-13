import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Crossword = {
  __typename?: 'Crossword';
  grid: Array<Point>;
  id: Scalars['String'];
  name: Scalars['String'];
};

export type Point = {
  __typename?: 'Point';
  value: Scalars['String'];
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  crossword: Crossword;
  test: Test;
};

export type Test = {
  __typename?: 'Test';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type TestQueryVariables = Exact<{ [key: string]: never; }>;


export type TestQuery = { __typename?: 'Query', test: { __typename?: 'Test', name: string } };

export type CrosswordQueryVariables = Exact<{ [key: string]: never; }>;


export type CrosswordQuery = { __typename?: 'Query', crossword: { __typename?: 'Crossword', name: string, grid: Array<{ __typename?: 'Point', x: number, y: number }> } };


export const TestDocument = gql`
    query Test {
  test {
    name
  }
}
    `;

/**
 * __useTestQuery__
 *
 * To run a query within a React component, call `useTestQuery` and pass it any options that fit your needs.
 * When your component renders, `useTestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTestQuery({
 *   variables: {
 *   },
 * });
 */
export function useTestQuery(baseOptions?: Apollo.QueryHookOptions<TestQuery, TestQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TestQuery, TestQueryVariables>(TestDocument, options);
      }
export function useTestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TestQuery, TestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TestQuery, TestQueryVariables>(TestDocument, options);
        }
export type TestQueryHookResult = ReturnType<typeof useTestQuery>;
export type TestLazyQueryHookResult = ReturnType<typeof useTestLazyQuery>;
export type TestQueryResult = Apollo.QueryResult<TestQuery, TestQueryVariables>;
export const CrosswordDocument = gql`
    query Crossword {
  crossword {
    name
    grid {
      x
      y
    }
  }
}
    `;

/**
 * __useCrosswordQuery__
 *
 * To run a query within a React component, call `useCrosswordQuery` and pass it any options that fit your needs.
 * When your component renders, `useCrosswordQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCrosswordQuery({
 *   variables: {
 *   },
 * });
 */
export function useCrosswordQuery(baseOptions?: Apollo.QueryHookOptions<CrosswordQuery, CrosswordQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CrosswordQuery, CrosswordQueryVariables>(CrosswordDocument, options);
      }
export function useCrosswordLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CrosswordQuery, CrosswordQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CrosswordQuery, CrosswordQueryVariables>(CrosswordDocument, options);
        }
export type CrosswordQueryHookResult = ReturnType<typeof useCrosswordQuery>;
export type CrosswordLazyQueryHookResult = ReturnType<typeof useCrosswordLazyQuery>;
export type CrosswordQueryResult = Apollo.QueryResult<CrosswordQuery, CrosswordQueryVariables>;