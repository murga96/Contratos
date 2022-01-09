import { gql } from "@apollo/client";

export const selectAllTipoContrato = gql`
  query findAllTipoContrato {
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
  mutation removeTipoContrato($id: Int!) {
    removeTipoContrato(id: $id) {
      tipoContrato
    }
  }
`;

export const removeSeveralTipoContrato = gql`
  mutation removeSeveralTipoContrato($id: [Int!]!) {
    removeSeveralTipoContrato(id: $id) {
      tipoContrato
    }
  }
`;

//Tipo de Clausulas
export const selectAllTiposDeClausulas = gql`
  query selectAllTiposDeClausulas {
    findAllTiposDeClausulas {
      idTipoClausula
      nombre
      orden
      basesG
      compras
      cMarco
      excepcional
    }
  }
`;

export const updateTiposDeClausulas = gql`
  mutation createTiposDeClausulas($tipoClausula: CreateTiposDeClausulaInput!) {
    createTiposDeClausulas(createTiposDeClausulaInput: $tipoClausula) {
      idTipoClausula
      nombre
      orden
      basesG
      compras
      cMarco
      excepcional
    }
  }
`;

export const removeTiposDeClausulas = gql`
  mutation removeTiposDeClausulas($id: Int!) {
    removeTiposDeClausulas(id: $id) {
      nombre
    }
  }
`;

export const removeSeveralTiposDeClausulas = gql`
  mutation removeSeveralTiposDeClausulas($id: [Int!]!) {
    removeSeveralTiposDeClausulas(id: $id) {
      nombre
    }
  }
`;

//Tipos de Documentos
export const selectAllTiposDocumentos = gql`
  query selectAllTiposDocumentos {
    findAllTiposDocumento {
      idTipoDoc
      nombreDoc
    }
  }
`;

export const updateTiposDocumentos = gql`
  mutation createTiposDocumentos($tipoDocumentos: CreateTiposDocumentoInput!) {
    createTiposDocumento(createTiposDocumentoInput: $tipoDocumentos) {
      idTipoDoc
      nombreDoc
    }
  }
`;

export const removeTiposDocumentos = gql`
  mutation removeTiposDocumentos($id: Int!) {
    removeTiposDocumento(id: $id) {
      nombreDoc
    }
  }
`;

export const removeSeveralTiposDocumentos = gql`
  mutation removeSeveralTiposDocumentos($id: [Int!]!) {
    removeSeveralTiposDocumento(id: $id) {
      nombreDoc
    }
  }
`;

//Cargo
export const selectAllCargo = gql`
  query selectAllCargo {
    findAllCargos {
      idCargo
      cargo
    }
  }
`;

export const updateCargo = gql`
  mutation createCargo($cargo: CreateCargoInput!) {
    createCargo(createCargoInput: $cargo) {
      idCargo
      cargo
    }
  }
`;

export const removeCargo = gql`
  mutation removeCargo($id: Int!) {
    removeCargo(id: $id) {
      cargo
    }
  }
`;

export const removeSeveralCargo = gql`
  mutation removeSeveralCargo($id: [Int!]!) {
    removeSeveralCargo(id: $id) {
      cargo
    }
  }
`;

//Ejecutivos
export const selectAllEjecutivos = gql`
  query selectAllEjecutivos {
    findAllEjecutivos {
      idEjecutivo
      nombre
      correo
      cargo {
        idCargo
        cargo
      }
      grupo {
        idGrupo
        grupos
      }
      activo
    }
  }
`;

export const updateEjecutivo = gql`
  mutation createEjecutivo($ejecutivo: CreateEjecutivoInput!) {
    createEjecutivo(createEjecutivoInput: $ejecutivo) {
      idEjecutivo
    }
  }
`;

export const removeEjecutivo = gql`
  mutation removeEjecutivo($id: Int!) {
    removeEjecutivo(id: $id) {
      nombre
    }
  }
`;

export const removeSeveralEjecutivo = gql`
  mutation removeSeveralEjecutivo($id: [Int!]!) {
    removeSeveralEjecutivo(id: $id) {
      nombre
    }
  }
`;

//Grupos
export const selectAllGrupos = gql`
  query selectAllGrupos {
    findAllGrupos {
      idGrupo
      grupos
    }
  }
`;

//Incoterms
export const selectAllIncoterm = gql`
  query selectAllIncoterm {
    findAllIncoterm {
      idIncoterm
      nombre
      abreviatura
      nota
      activo
    }
  }
`;

export const updateIncoterm = gql`
  mutation createIncoterm($incoterm: CreateIncotermInput!) {
    createIncoterm(createIncotermInput: $incoterm) {
      idIncoterm
    }
  }
`;

export const removeIncoterm = gql`
  mutation removeIncoterm($id: Int!) {
    removeIncoterm(id: $id) {
      nombre
    }
  }
`;

export const removeSeveralIncoterm = gql`
  mutation removeSeveralIncoterm($id: [Int!]!) {
    removeSeveralIncoterm(id: $id) {
      nombre
    }
  }
`;

//Moneda
export const selectAllMonedas = gql`
  query selectAllMonedas {
    findAllMoneda {
      idMoneda
      moneda
      abreviatura
    }
  }
`;

export const updateMoneda = gql`
  mutation createMoneda($moneda: CreateMonedaInput!) {
    createMoneda(createMonedaInput: $moneda) {
      moneda
    }
  }
`;

export const removeMoneda = gql`
  mutation removeMoneda($id: Int!) {
    removeMoneda(id: $id) {
      moneda
    }
  }
`;

export const removeSeveralMoneda = gql`
  mutation removeSeveralMoneda($id: [Int!]!) {
    removeSeveralMoneda(id: $id) {
      moneda
    }
  }
`;

//Puertos
export const selectAllPuertos = gql`
  query selectAllPuertos {
    findAllPuertos {
      idPuerto
      nombre
      deposito
      pais
    }
  }
`;

export const updatePuerto = gql`
  mutation createPuerto($puerto: CreatePuertoInput!) {
    createPuerto(createPuertoInput: $puerto) {
      nombre
    }
  }
`;

export const removePuerto = gql`
  mutation removePuerto($id: Int!) {
    removePuerto(id: $id) {
      nombre
    }
  }
`;

export const removeSeveralPuerto = gql`
  mutation removeSeveralPuerto($id: [Int!]!) {
    removeSeveralPuerto(id: $id) {
      nombre
    }
  }
`;
