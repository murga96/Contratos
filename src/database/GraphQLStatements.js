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


