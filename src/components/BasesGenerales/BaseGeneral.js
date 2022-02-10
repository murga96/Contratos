import { useQuery } from '@apollo/client';
import { ProgressSpinner } from 'primereact/progressspinner';
import React from 'react';
import { useParams } from 'react-router';
import { selectOneBasesGenerales } from '../../database/GraphQLStatements';

export const BaseGeneral = ({idBG}) => {
    const bg = useParams()
    const {data , error, loading} = useQuery(selectOneBasesGenerales, {variables: {"idBasesG": parseInt(bg.BaseGeneral)}})
  return (
    <div>
      {loading &&  (<div className="flex h-30rem justify-content-center align-items-center"><ProgressSpinner strokeWidth="3" /></div>)}   
      {!(loading || error) ? (
        <div>
        </div>
      ) : (
        undefined
      )}
    </div>
  );
};
