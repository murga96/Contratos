import { gql } from "@apollo/client";

export const selectAllTipoContrato = gql`
  query findAllTipoContrato{
    findAllTipoContrato {
      idTipoContrato
      tipoContrato
      encabezado
      ambasPartes
      visible
    }
  }
`;
export const updateTipoContrato = gql`
  mutation createTipoContrato($tipoContrato: CreateTipoContratoInput!) {
    createTipoContrato(createTipoContratoInput: $tipoContrato) {
      idTipoContrato
      tipoContrato
      encabezado
      ambasPartes
      visible
    }
  }
`;

export const removeTipoContrato = gql`
  mutation removeTipoContrato($id: Int!){
  removeTipoContrato(id:$id) {
    tipoContrato
  }
}
`;

//Tipo de Clausulas
export const selectAllTiposDeClausulas = gql`
query selectAllTiposDeClausulas{
  findAllTiposDeClausulas {
    idTipoClausula,
    nombre,
    orden,
    basesG,
    compras,
    cMarco,
    excepcional, 
  }
}
`;

export const updateTiposDeClausulas = gql`
  mutation createTiposDeClausulas($tipoClausula: CreateTiposDeClausulaInput!) {
    createTiposDeClausulas(createTiposDeClausulaInput: $tipoClausula) {
      idTipoClausula,
      nombre,
      orden,
      basesG,
      compras,
      cMarco,
      excepcional, 
    }
  }
`;

export const removeTiposDeClausulas = gql`
  mutation removeTiposDeClausulas($id: Int!){
    removeTiposDeClausulas(id:$id) {
    nombre
  }
}
`;

export const removeSeveralTiposDeClausulas = gql`
  mutation removeSeveralTiposDeClausulas($id: [Int!]!){
  removeSeveralTiposDeClausulas(id: $id){
    nombre
  }
}
`;


