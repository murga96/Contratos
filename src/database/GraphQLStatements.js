import { gql } from "@apollo/client";

export const selectAllTipoContrato = gql`
  query selectAllTipoContrato {
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
      pais {
        pais
        nomb
      }
      deposito
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

//TiposDeCompras
export const selectAllTiposDeCompras = gql`
  query selectAllTiposDeCompras {
    findAllTiposDeCompras {
      idTipoCompras
      compras
    }
  }
`;

export const updateTiposDeCompras = gql`
  mutation createTiposDeCompras($tiposDeCompra: CreateTiposDeCompraInput!) {
    createTiposDeCompras(createTiposDeCompraInput: $tiposDeCompra) {
      compras
    }
  }
`;

export const removeTiposDeCompras = gql`
  mutation removeTiposDeCompras($id: Int!) {
    removeTiposDeCompras(id: $id) {
      compras
    }
  }
`;

export const removeSeveralTiposDeCompras = gql`
  mutation removeSeveralTiposDeCompras($id: [Int!]!) {
    removeSeveralTiposDeCompras(id: $id) {
      compras
    }
  }
`;

//TiposContenedor
export const selectAllTiposContenedor = gql`
  query selectAllTiposContenedor {
    findAllTiposContenedor {
      idTipoContenedor
      tipoContenedor
    }
  }
`;

export const updateTiposContenedor = gql`
  mutation createTiposContenedor(
    $tiposContenedor: CreateTiposContenedorInput!
  ) {
    createTiposContenedor(createTiposContenedorInput: $tiposContenedor) {
      tipoContenedor
    }
  }
`;

export const removeTiposContenedor = gql`
  mutation removeTiposContenedor($id: Int!) {
    removeTiposContenedor(id: $id) {
      tipoContenedor
    }
  }
`;

export const removeSeveralTiposContenedor = gql`
  mutation removeSeveralTiposContenedor($id: [Int!]!) {
    removeSeveralTiposContenedor(id: $id) {
      tipoContenedor
    }
  }
`;

//Grupos de Compra
export const selectGrupos = gql`
  query selectAllGrupos {
    findAllGrupos {
      idGrupo
      grupos
    }
  }
`;

export const updateGruposDeCompra = gql`
  mutation createGruposDeCompra($grupo: CreateGruposDeCompraInput!) {
    createGruposDeCompra(createGruposDeCompraInput: $grupo) {
      grupos
    }
  }
`;

export const removeGruposDeCompra = gql`
  mutation removeGruposDeCompra($id: Int!) {
    removeGruposDeCompra(id: $id) {
      grupos
    }
  }
`;

export const removeSeveralGruposDeCompra = gql`
  mutation removeSeveralGruposDeCompra($id: [Int!]!) {
    removeSeveralGruposDeCompra(id: $id) {
      grupos
    }
  }
`;

//Formas de Pago
export const selectFormasPago = gql`
  query selectAllFormasPago {
    findAllFormasPago {
      idFormaPago
      formaPago
      dias
    }
  }
`;

export const updateFormasPago = gql`
  mutation createFormasPago($formaPago: CreateFormasPagoInput!) {
    createFormasPago(createFormasPagoInput: $formaPago) {
      formaPago
    }
  }
`;

export const removeFormasPago = gql`
  mutation removeFormasPago($id: Int!) {
    removeFormasPago(id: $id) {
      formaPago
    }
  }
`;

export const removeSeveralFormasPago = gql`
  mutation removeSeveralFormasPago($id: [Int!]!) {
    removeSeveralFormasPago(id: $id) {
      formaPago
    }
  }
`;

//Formas de Entrega
export const selectFormasEntrega = gql`
  query selectAllFormasEntrega {
    findAllFormasEntrega {
      idFormaEntrega
      formaEntrega
      dias
    }
  }
`;

export const updateFormasEntrega = gql`
  mutation createFormasEntrega($formaEntrega: CreateFormasEntregaInput!) {
    createFormasEntrega(createFormasEntregaInput: $formaEntrega) {
      formaEntrega
    }
  }
`;

export const removeFormasEntrega = gql`
  mutation removeFormasEntrega($id: Int!) {
    removeFormasEntrega(id: $id) {
      formaEntrega
    }
  }
`;

export const removeSeveralFormasEntrega = gql`
  mutation removeSeveralFormasEntrega($id: [Int!]!) {
    removeSeveralFormasEntrega(id: $id) {
      formaEntrega
    }
  }
`;

//Etapas Contratacion
export const selectAllEtapasContratacion = gql`
  query selectAllEtapasContratacion {
    findAllEtapasContratacion {
      idEtapa
      etapa
      calculos
      tiempoMax
      tiempoReal
    }
  }
`;

export const updateEtapasContratacion = gql`
  mutation createEtapasContratacion($etapa: CreateEtapasContratacionInput!) {
    createEtapasContratacion(createEtapasContratacionInput: $etapa) {
      tiempoMax
    }
  }
`;

export const removeEtapasContratacion = gql`
  mutation removeEtapasContratacion($id: Int!) {
    removeEtapasContratacion(id: $id) {
      tiempoMax
    }
  }
`;

export const removeSeveralEtapasContratacion = gql`
  mutation removeSeveralEtapasContratacion($id: [Int!]!) {
    removeSeveralEtapasContratacion(id: $id) {
      tiempoMax
    }
  }
`;

//Paises
export const selectAllPaises = gql`
  query selectAllPaises {
    findAllPaises {
      pais
      nomb
    }
  }
`;

//Usuarios
export const selectAllUsuarios = gql`
  query selectAllUsuarios {
    findAllUsuarios {
      idUsuario
      nombreUsuario
      ejecutivo {
        idEjecutivo
        nombre
      }
      usuarioRoles {
        rol {
          idRol
          rol
        }
      }
    }
  }
`;

export const updateUsuario = gql`
  mutation createUsuario($usuario: CreateUsuarioInput!) {
    createUsuario(createUsuarioInput: $usuario) {
      nombreUsuario
    }
  }
`;

export const removeUsuario = gql`
  mutation removeUsuario($id: Int!) {
    removeUsuario(id: $id) {
      nombreUsuario
    }
  }
`;

export const removeSeveralUsuario = gql`
  mutation removeSeveralUsuario($id: [Int!]!) {
    removeSeveralUsuario(id: $id) {
      nombreUsuario
    }
  }
`;

export const autenticarUsuario = gql`
  query autenticarUsuario($nombreUsuario: String!, $contrasena: String!) {
    autenticarUsuarios(nombreUsuario: $nombreUsuario, contrasena: $contrasena) {
      idUsuario
      nombreUsuario
      idEjecutivo
      token
      usuarioRoles {
        rol {
          idRol
          rol
        }
      }
    }
  }
`;
export const refreshToken = gql`
  mutation refreshToken {
    refreshToken {
      token
    }
  }
`;

export const forcePasswordUsuario = gql`
  mutation forcePasswordUsuario($idUsuario: Int!) {
    forcePasswordUsuario(idUsuario: $idUsuario) {
      nombreUsuario
    }
  }
`;

export const changePasswordUsuario = gql`
  mutation modifyPasswordUsuario(
    $idUsuario: Int!
    $contrasenaVieja: String!
    $contrasenaNueva: String!
    $contrasenaNuevaConfirmar: String!
  ) {
    modifyPasswordUsuario(
      idUsuario: $idUsuario
      contrasenaVieja: $contrasenaVieja
      contrasenaNueva: $contrasenaNueva
      contrasenaNuevaConfirmar: $contrasenaNuevaConfirmar
    ) {
      nombreUsuario
    }
  }
`;

//Roles
export const selectAllRoles = gql`
  query selectAllRoles {
    findAllRoles {
      idRol
      rol
    }
  }
`;

//Bases Generales
export const selectAllBasesGenerales = gql`
  query selectAllBasesGenerales {
    findAllBasesGenerales {
      idBasesGenerales
      consecutivo
      tipoDeContrato {
        tipoContrato
      }
      incoterm {
        abreviatura
      }
      proveedor {
        codigo
      }
      pais {
        nomb
      }
      compradores {
        nombre
      }
      fecha
    }
  }
`;

export const selectOneBasesGenerales = gql`
  query selectOneBasesGenerales($idBasesG: Int!) {
    findOneBasesGenerales(id: $idBasesG) {
      idBasesGenerales
      consecutivo
      tipoDeContrato {
        idTipoContrato
        tipoContrato
      }
      incoterm {
        idIncoterm
        nombre
        abreviatura
      }
      proveedor {
        codigo
        compaIa
        cargo
        representante
        domicilio
      }
      pais {
        pais
        nomb
      }
      compradores {
        idComprador
        nombre
        representante
        domicilio
        cargo
      }
      basesGeneralesClausulas {
        idTipoClausula
        tiposDeClausulas {
          idTipoClausula
          nombre
        }
        orden
        clausula
        excepcional
      }
      idIncoterm
      idPais
      idProveedor
      idProforma
      idComprador
      vigencia
      aprobado
      cancelado
      activo
      lugardeFirma
      fecha
    }
  }
`;

export const updateBaseGeneral = gql`
  mutation createBasesGenerales(
    $createBasesGeneraleInput: CreateBasesGeneralesInput!
  ) {
    createBasesGenerales(createBasesGeneraleInput: $createBasesGeneraleInput) {
      idBasesGenerales
    }
  }
`;

export const actualizarClausulasFromBaseGeneral = gql`
  mutation actualizarClausulasFromBaseGeneral($id: Float!) {
    actualizarClausulasFromBaseGeneral(idBaseGeneral: $id) {
      idBasesGeneralesClausulas
      idTipoClausula
      tiposDeClausulas {
        idTipoClausula
        nombre
      }
      orden
      clausula
      excepcional
    }
  }
`;
export const getClausulasFromBaseGeneral = gql`
  mutation getClausulasFromBaseGeneral($idIncoterm: Int!, $idProveedor: Int!) {
    actualizarClausulasFromBaseGeneral(
      idIncoterm: $idIncoterm
      idProveedor: $idProveedor
    ) {
      idBasesGeneralesClausulas
      idTipoClausula
      tiposDeClausulas {
        idTipoClausula
        nombre
      }
      orden
      clausula
      excepcional
    }
  }
`;
//Compradores
export const selectAllCompradores = gql`
  query selectAllCompradores {
    findAllCompradores {
      idComprador
      nombre
      representante
      domicilio
      cargo
      doble
      activo
    }
  }
`;
//Proveedores
export const selectAllProveedores = gql`
  query selectAllProveedores {
    findAllProveedores {
      codigo
      compaIa
      siglas
      domicilio
      domicilioSucursal
      ciudad
      eMail
      representante
      cargo
      pais
      activo
      cuentaUsd
    }
  }
`;
// export const selectOneBasesGenerales = gql`
//   query selectOneBasesGenerales($idBasesG: Int!) {
//     findOneBasesGenerales(id: $idBasesG) {
//Proforma
export const selectOneProforma = gql`
  query selectOneProforma($id: Int!) {
    findOneProforma(id: $id) {
      idProforma
      proformaClausulas {
        idProformaClausula
        idTipoClausula
        orden
        clausula
      }
    }
  }
`;
