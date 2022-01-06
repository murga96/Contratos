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

export const removeSeveralTipoContrato = gql`
  mutation removeSeveralTipoContrato($id: [Int!]!){
  removeSeveralTipoContrato(id: $id){
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

//Tipos de Documentos
export const selectAllTiposDocumentos = gql`
query selectAllTiposDocumentos{
  findAllTiposDocumento {
    idTipoDoc,
    nombreDoc,
  }
}
`;

export const updateTiposDocumentos = gql`
  mutation createTiposDocumentos($tipoDocumentos: CreateTiposDocumentoInput!) {
    createTiposDocumento(createTiposDocumentoInput: $tipoDocumentos) {
      idTipoDoc,
      nombreDoc
    }
  }
`;

export const removeTiposDocumentos = gql`
  mutation removeTiposDocumentos($id: Int!){
    removeTiposDocumento(id:$id) {
      nombreDoc
  }
}
`;

export const removeSeveralTiposDocumentos = gql`
  mutation removeSeveralTiposDocumentos($id: [Int!]!){
  removeSeveralTiposDocumento(id: $id){
    nombreDoc
  }
}
`;

//Cargo
export const selectAllCargo = gql`
query selectAllCargo{
  findAllCargos {
    idCargo,
    cargo,
  }
}
`;

export const updateCargo = gql`
  mutation createCargo($cargo: CreateCargoInput!) {
    createCargo(CreateCargoInput: $cargo) {
      idCargo,
      cargo,
    }
  }
`;

export const removeCargo = gql`
  mutation removeCargo($id: Int!){
    removeCargo(id:$id) {
      cargo,
  }
}
`;

export const removeSeveralCargo = gql`
  mutation removeSeveralCargo($id: [Int!]!){
    removeSeveralCargo(id: $id){
    cargo,
  }
}
`;

