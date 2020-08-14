export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};



export type Query = {
  __typename?: 'Query';
  load?: Maybe<Scalars['JSON']>;
  resources?: Maybe<ResourcesListResponse>;
};


export type QueryLoadArgs = {
  measures?: Maybe<Array<Scalars['String']>>;
  dimensions?: Maybe<Array<Maybe<Scalars['String']>>>;
  timeDimensions?: Maybe<Array<Maybe<TimeDimensionInput>>>;
  order?: Maybe<Scalars['JSON']>;
};


export type QueryResourcesArgs = {
  filter?: Maybe<ResourceFilter>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  resourceCreate?: Maybe<Resource>;
  resourceUpdate?: Maybe<Resource>;
};


export type MutationResourceCreateArgs = {
  data?: Maybe<ResourceCreateInput>;
};


export type MutationResourceUpdateArgs = {
  id?: Maybe<Scalars['String']>;
  data?: Maybe<ResourceUpdateInput>;
};

export type TimeDimensionInput = {
  dimension?: Maybe<Scalars['String']>;
  dateRange?: Maybe<Array<Maybe<Scalars['String']>>>;
  granularity?: Maybe<Scalars['String']>;
};

export type Resource = {
  __typename?: 'Resource';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['Int']>;
  defaultWebsiteUrl?: Maybe<Scalars['String']>;
  createTime?: Maybe<Scalars['Int']>;
  updateTime?: Maybe<Scalars['Int']>;
};

export type ResourcesListResponse = {
  __typename?: 'ResourcesListResponse';
  count?: Maybe<Scalars['Int']>;
  resources?: Maybe<Array<Maybe<Resource>>>;
};

export type ResourceFilter = {
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type ResourceCreateInput = {
  name?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['Int']>;
  defaultWebsiteUrl?: Maybe<Scalars['String']>;
};

export type ResourceUpdateInput = {
  name?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['Int']>;
  defaultWebsiteUrl?: Maybe<Scalars['String']>;
};
