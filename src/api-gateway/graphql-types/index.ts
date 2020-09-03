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
  customDefinitions?: Maybe<CustomDefinitionsListResponse>;
};


export type QueryLoadArgs = {
  measures?: Maybe<Array<Scalars['String']>>;
  dimensions?: Maybe<Array<Maybe<Scalars['String']>>>;
  timeDimensions?: Maybe<Array<Maybe<TimeDimensionInput>>>;
  filters?: Maybe<Array<Maybe<FilterInput>>>;
  order?: Maybe<Scalars['JSON']>;
};


export type QueryResourcesArgs = {
  filter?: Maybe<ResourceFilter>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Scalars['String']>;
};


export type QueryCustomDefinitionsArgs = {
  filter?: Maybe<CustomDefinitionFilter>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  resourceCreate?: Maybe<Resource>;
  resourceUpdate?: Maybe<Resource>;
  customDefinitionCreate?: Maybe<CustomDefinition>;
  customDefinitionUpdate?: Maybe<CustomDefinition>;
};


export type MutationResourceCreateArgs = {
  data?: Maybe<ResourceCreateInput>;
};


export type MutationResourceUpdateArgs = {
  id?: Maybe<Scalars['String']>;
  data?: Maybe<ResourceUpdateInput>;
};


export type MutationCustomDefinitionCreateArgs = {
  data?: Maybe<CustomDefinitionCreateInput>;
};


export type MutationCustomDefinitionUpdateArgs = {
  id?: Maybe<Scalars['String']>;
  data?: Maybe<CustomDefinitionUpdateInput>;
};

export type FilterInput = {
  member?: Maybe<Scalars['String']>;
  operator?: Maybe<Scalars['String']>;
  values?: Maybe<Array<Maybe<Scalars['String']>>>;
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

export type CustomDefinition = {
  __typename?: 'CustomDefinition';
  id?: Maybe<Scalars['String']>;
  resourceId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['Int']>;
  scope?: Maybe<Scalars['Int']>;
  active?: Maybe<Scalars['Boolean']>;
};

export type CustomDefinitionsListResponse = {
  __typename?: 'CustomDefinitionsListResponse';
  count?: Maybe<Scalars['Int']>;
  customDefinitions?: Maybe<Array<Maybe<CustomDefinition>>>;
};

export type CustomDefinitionFilter = {
  id?: Maybe<Scalars['String']>;
  resourceId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type CustomDefinitionCreateInput = {
  name?: Maybe<Scalars['String']>;
  resourceId?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['Int']>;
  scope?: Maybe<Scalars['Int']>;
  active?: Maybe<Scalars['Boolean']>;
};

export type CustomDefinitionUpdateInput = {
  name?: Maybe<Scalars['String']>;
  scope?: Maybe<Scalars['Int']>;
  active?: Maybe<Scalars['Boolean']>;
};
