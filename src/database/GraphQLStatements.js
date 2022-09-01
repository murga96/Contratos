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

//NegociacionesResumen
export const selectAllNegociacionesResumen = gql`
  query selectAllNegociacionesResumen {
    findAllNegociacionResumen {
      idNegociacion
      consecutivo
      noNegociacion
      fecha
      comite
      idTipoCompras
      grupos {
        idGrupo
        grupos
      }
      monedas {
        idMoneda
        moneda
      }
      tiposDeCompras {
        idTipoCompras
        compras
      }
      negociacionProveedores {
        idProveedor
        importe
        ladi
        proveedor {
          codigo
          compaIa
        }
      }
      mercancias
      aprobada
      cancelada
      nota
      importeTrd
      importeGae
      importeCuc
      comentarios
      operacion
      tasa
      terminado
      negociacionProveedores {
        idNegociacionProveedores
        importe
        ladi
      }
    }
  }
`;
export const selectOneNegociacionesResumen = gql`
  query selectOneNegociacionesResumen($idBasesG: Int!) {
    findOneNegociacionResumen(id: $idBasesG) {
      idNegociacion
      consecutivo
      noNegociacion
      fecha
      comite
      idTipoCompras
      grupos {
        idGrupo
        grupos
      }
      monedas {
        idMoneda
        moneda
      }
      tiposDeCompras {
        idTipoCompras
        compras
      }
      negociacionProveedores {
        idProveedor
        importe
        ladi
        idNegociacion
        proveedor {
          codigo
          compaIa
        }
      }
      mercancias
      aprobada
      cancelada
      nota
      importeTrd
      importeGae
      importeCuc
      comentarios
      operacion
      tasa
      terminado
      negociacionProveedores {
        idNegociacionProveedores
        importe
        ladi
      }
    }
  }
`;

export const updateNegociacionResumen = gql`
  mutation createNegociacionResumen(
    $createNegociacionResumenInput: CreateNegociacionResumenInput!
  ) {
    createNegociacionResumen(
      createNegociacionResumenInput: $createNegociacionResumenInput
    ) {
      consecutivo
    }
  }
`;

export const removeNegociacionResumen = gql`
  mutation removeNegociacionResumen($id: Int!) {
    removeNegociacionResumen(id: $id) {
      consecutivo
    }
  }
`;

export const removeSeveralNegociacionResumen = gql`
  mutation removeSeveralNegociacionResumen($id: [Int!]!) {
    removeSeveralNegociacionResumen(id: $id) {
      consecutivo
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

//Configuracion
export const selectConfiguraciones = gql`
  query selectConfiguraciones {
    findAllConfiguracion {
      idConfig
      entidad {
        idEntidad
        nombre
      }
      lugarFirma
      pathContratosPdf
      vigenciaContrato
      alertaVencContratos
      idEntidad
    }
  }
`;

export const updateConfiguracion = gql`
  mutation updateConfiguracion(
    $createConfiguracionInput: CreateConfiguracionInput!
  ) {
    createConfiguracion(createConfiguracionInput: $createConfiguracionInput) {
      lugarFirma
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
//Naviera
export const selectAllCompaniasNavieras = gql`
  query selectAllCompaniasNavieras {
    findAllCompaniasNavieras {
      id
      nombre
      diasdegracia
    }
  }
`;
//Seguros
export const selectAllAgenciasAseguradoras = gql`
  query selectAllAgenciasAseguradoras {
    findAllAgenciasAseguradoras {
      idAgenciaS
      nombre
      direccion
      telefono
      contacto
      valor
    }
  }
`;

//Bases Generales
// export const selectAllBasesGenerales = gql`
//   query selectAllBasesGenerales {
//     findAllBasesGenerales {
//       idBasesGenerales
//       consecutivo
//       noContrato
//       tipoDeContrato {
//         idTipoContrato
//         tipoContrato
//         encabezado
//         ambasPartes
//       }
//       incoterm {
//         idIncoterm
//         nombre
//         abreviatura
//       }
//       proveedor {
//         codigo
//         compaIa
//         cargo
//         representante
//         domicilio
//         cuentaMn
//         cuentaUsd
//         agenciaMn
//         agenciaUsd
//         cargo
//       }
//       pais {
//         pais
//         nomb
//       }
//       compradores {
//         idComprador
//         nombre
//         representante
//         domicilio
//         cargo
//         entidad {
//           codigoEnt
//           cuentaUsd
//           agenciaUsd
//           cuentaMn
//           agenciaMn
//         }
//       }
//       basesGeneralesClausulas {
//         idBasesGeneralesClausulas
//         numero
//         idBasesGenerales
//         idTipoClausula
//         tiposDeClausulas {
//           idTipoClausula
//           nombre
//         }
//         orden
//         clausula
//         excepcional
//         modificado
//       }
//       idIncoterm
//       idPais
//       idProveedor
//       idComprador
//       vigencia
//       aprobado
//       cancelado
//       activo
//       lugardeFirma
//       fecha
//       fechaVencimiento
//       contratos {
//         idContrato
//         idBasesGenerales
//         idCMarco
//         idMoneda
//         idFormaEntrega
//         idNegociacion
//         realizadoPor
//         firmadoPor
//         modificadoPor
//         lugarFirma
//         consecutivo
//         idIncoterm
//         cancelado
//         terminado
//         modificado
//         empresaSeguro
//         idEmpresaNaviera
//         lugarEntrega
//         notas
//         permitirEmbarquesParciales
//         cantidadEp
//         permitirEntregas
//         permitirTrasbordos
//         producto
//         noEntregasParciales
//         fechaElaboracion
//         fechaInicial
//         fechaFinal
//         fechaFirma
//         fechaRecepcion
//         fechaArribo
//         fechaPFirma
//         financiamiento
//         tasaMoneda
//         fechaTasa
//         pFin
//         gastosLogisticos
//         contratoClausulas {
//           idContratoClausulas
//           noClausula
//           contenido
//         }
//         contratoMarco {
//           idCMarco
//           consecutivo
//         }
//         moneda {
//           idMoneda
//           moneda
//           abreviatura
//         }
//         formaEntrega {
//           idFormaEntrega
//           formaEntrega
//         }
//         negociacionResumen {
//           idNegociacion
//           consecutivo
//           noNegociacion
//         }
//         ejecutivoRealiza {
//           idEjecutivo
//           nombre
//         }
//         ejecutivoFirma {
//           idEjecutivo
//           nombre
//         }
//         ejecutivoModifica {
//           idEjecutivo
//           nombre
//         }
//         documentacionContratos {
//           idDocumentacionContrato
//           documentacion {
//             idDocumento
//             nombreFichero
//             descripcion
//           }
//         }
//         embarques {
//           idEmbarque
//           numero
//           fechaEntrega
//           terminado
//           cancelado
//           porFirmar
//           flete
//           seguro
//           idContrato
//           qtyCnt
//           seguro
//           financiamiento
//           inspeccion
//           otros
//           c40
//           c20
//           actSci
//         }
//         facturaResumen {
//           idFactura
//         }
//         suplementoEmbarques {
//           idSuplementoEmbarques
//         }
//         suplementoResumen {
//           idSuplementoResumen
//         }
//         suplementoClausulas {
//           idSuplementoClausulas
//         }
//         companiaNaviera {
//           id
//           nombre
//         }
//         incoterm {
//           idIncoterm
//           nombre
//           abreviatura
//         }
//       }
//       idIncoterm
//       idPais
//       idProveedor
//       idComprador
//       vigencia
//       aprobado
//       cancelado
//       activo
//       lugardeFirma
//       fecha
//       fechaVencimiento
//     }
//   }
// `;

export const selectAllBasesGenerales = gql`
  query selectAllBasesGenerales(
    $take: Int
    $skip: Int
    $orden: Int
    $campo: String
    $where: FilterBasesGeneralesInput
  ) {
    findAllBasesGenerales(
      take: $take
      skip: $skip
      orden: $orden
      campo: $campo
      where: $where
    ) {
      count
      data {
        idBasesGenerales
        consecutivo
        noContrato
        tipoDeContrato {
          idTipoContrato
          tipoContrato
          encabezado
          ambasPartes
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
          cuentaMn
          cuentaUsd
          agenciaMn
          agenciaUsd
          cargo
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
          entidad {
            codigoEnt
            cuentaUsd
            agenciaUsd
            cuentaMn
            agenciaMn
          }
        }
        idIncoterm
        idPais
        idProveedor
        idComprador
        vigencia
        aprobado
        cancelado
        activo
        lugardeFirma
        fecha
        fechaVencimiento
      }
    }
  }
`;

export const selectOneBasesGenerales = gql`
  query selectOneBasesGenerales($id: Int!) {
    findOneBasesGenerales(id: $id) {
      idBasesGenerales
      consecutivo
      noContrato
      idIncoterm
      idPais
      idProveedor
      idComprador
      vigencia
      aprobado
      cancelado
      activo
      lugardeFirma
      fecha
      fechaVencimiento
      tipoDeContrato {
        idTipoContrato
        tipoContrato
        encabezado
        ambasPartes
      }
      incoterm {
        idIncoterm
        nombre
        abreviatura
      }
      proveedor {
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
        activo
        doble
      }
      basesGeneralesClausulas {
        idBasesGeneralesClausulas
        numero
        idBasesGenerales
        idTipoClausula
        tiposDeClausulas {
          idTipoClausula
          nombre
        }
        orden
        clausula
        excepcional
        modificado
      }
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

export const removeBaseGeneral = gql`
  mutation removeBasesGenerales($id: Int!) {
    removeBasesGenerales(id: $id) {
      consecutivo
    }
  }
`;
export const removeSeveralBasesGenerales = gql`
  mutation removeSeveralBasesGenerales($id: [Int!]!) {
    removeSeveralBasesGenerales(id: $id) {
      consecutivo
    }
  }
`;

export const actualizarClausulasFromBaseGeneral = gql`
  query actualizarClausulasFromBaseGeneral($id: Float!) {
    actualizarClausulasFromBaseGeneral(idBaseGeneral: $id) {
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
  query getClausulasFromBaseGeneral($idIncoterm: Int!, $idProveedor: Int!) {
    getClausulasFromBaseGeneral(
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
      entidad {
        idEntidad
        nombre
        codigoEnt
        cuentaUsd
        agenciaUsd
        cuentaMn
        agenciaMn
      }
      activo
      doble
    }
  }
`;
export const selectAllCompradoresWithoutRelations = gql`
  query selectAllCompradores {
    findAllCompradores {
      idComprador
      nombre
      representante
      domicilio
      cargo
      activo
      doble
    }
  }
`;

export const selectOneCompradores = gql`
  query selectOneCompradores($id: Int!) {
    findOneCompradores(id: $id) {
      idComprador
      nombre
      representante
      domicilio
      cargo
      entidad {
        nombre
      }
      activo
      doble
    }
  }
`;

export const createCompradores = gql`
  mutation createCompradores($createCompradoreInput: CreateCompradoresInput!) {
    createCompradore(createCompradoreInput: $createCompradoreInput) {
      representante
    }
  }
`;

export const removeCompradores = gql`
  mutation removeCompradores($id: Int!) {
    removeCompradores(id: $id) {
      representante
    }
  }
`;

export const removeSeveralCompradores = gql`
  mutation removeSeveralCompradores($id: [Int!]!) {
    removeSeveralCompradores(id: $id) {
      representante
    }
  }
`;

//Datos Entidad
export const selectAllDatosEntidades = gql`
  query findAllDatosEntidad {
    findAllDatosEntidad {
      idEntidad
      nombre
      compaIa
      agenciaUsd
      codAgenciaUsd
      cuentaUsd
      faxAgenciaUsd
      agenciaMn
      codAgenciaMn
      cuentaMn
      faxAgenciaMn
      codigoEnt
      codigoMincex
      licCComercio
    }
  }
`;

export const selectDatosEntidad = gql`
  query selectOneDatosEntidad($id: Int!) {
    findOneDatosEntidad(id: $id) {
      idEntidad
      nombre
      compaIa
      agenciaUsd
      codAgenciaUsd
      cuentaUsd
      faxAgenciaUsd
      agenciaMn
      codAgenciaMn
      cuentaMn
      faxAgenciaMn
      codigoEnt
      codigoMincex
      licCComercio
    }
  }
`;

export const createDatosEntidad = gql`
  mutation createDatosEntidad(
    $createDatosEntidadInput: CreateDatosEntidadInput!
  ) {
    createDatosEntidad(createDatosEntidadInput: $createDatosEntidadInput) {
      nombre
    }
  }
`;

export const removeDatosEntidad = gql`
  mutation removeDatosEntidad($id: Int!) {
    removeDatosEntidad(id: $id) {
      nombre
    }
  }
`;

export const removeSeveralDatosEntidad = gql`
  mutation removeSeveralDatosEntidad($id: [Int!]!) {
    removeSeveralDatosEntidad(id: $id) {
      nombre
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

// //Proforma
// export const selectOneProforma = gql`
//   query selectOneProforma($id: Int!) {
//     findOneProforma(id: $id) {
//       idProforma
//       nombreProfoma
//       proformaClausulas {
//         idProformaClausula
//         idProforma
//         idTipoClausula
//         orden
//         clausula
//         tiposDeClausulas {
//           idTipoClausula
//           nombre
//           basesG
//         }
//       }
//       tipoDeContrato {
//         tipoContrato
//       }
//       incoterm {
//         nombre
//         abreviatura
//       }
//       idTipoContrato
//       idIncoterm
//       activa
//       cMarcoF
//     }
//   }
// `;
// export const selectAllProforma = gql`
//   query selectAllProforma {
//     findAllProforma {
//       idProforma
//       nombreProfoma
//       idTipoContrato
//       idIncoterm
//       activa
//       cMarcoF
//       tipoDeContrato {
//         tipoContrato
//       }
//       proformaClausulas {
//         idProformaClausula
//         idProforma
//         idTipoClausula
//         orden
//         clausula
//         tiposDeClausulas {
//           idTipoClausula
//           nombre
//           basesG
//         }
//       }
//       incoterm {
//         nombre
//         abreviatura
//       }
//     }
//   }
// `;

// export const createProforma = gql`
//   mutation createProforma($createProformaInput: CreateProformaInput!) {
//     createProforma(createProformaInput: $createProformaInput) {
//       nombreProfoma
//     }
//   }
// `;

// export const removeProforma = gql`
//   mutation removeProforma($id: Int!) {
//     removeProforma(id: $id) {
//       nombreProfoma
//     }
//   }
// `;

export const removeSeveralProforma = gql`
  mutation removeSeveralProforma($id: [Int!]!) {
    removeSeveralProforma(id: $id) {
      nombreProfoma
    }
  }
`;

//Contrato
export const selectAllContrato = gql`
  query selectAllContratos {
    findAllContratos {
      idContrato
      idBasesGenerales
      idCMarco
      idMoneda
      idFormaEntrega
      idNegociacion
      realizadoPor
      firmadoPor
      modificadoPor
      lugarFirma
      consecutivo
      idIncoterm
      idPais
      cancelado
      terminado
      modificado
      empresaSeguro
      idEmpresaNaviera
      lugarEntrega
      notas
      permitirEmbarquesParciales
      cantidadEp
      permitirEntregas
      permitirTrasbordos
      producto
      noEntregasParciales
      fechaElaboracion
      fechaInicial
      fechaFinal
      fechaFirma
      fechaRecepcion
      fechaArribo
      fechaPFirma
      financiamiento
      tasaMoneda
      fechaTasa
      pFin
      gastosLogisticos
      contratoClausulas {
        idContratoClausulas
        noClausula
        contenido
      }
      basesGenerales {
        idBasesGenerales
        noContrato
      }
      contratoMarco {
        idCMarco
        consecutivo
      }
      moneda {
        idMoneda
        moneda
        abreviatura
      }
      formaEntrega {
        idFormaEntrega
        formaEntrega
      }
      negociacionResumen {
        idNegociacion
        consecutivo
        noNegociacion
      }
      ejecutivoRealiza {
        idEjecutivo
        nombre
      }
      ejecutivoFirma {
        idEjecutivo
        nombre
      }
      ejecutivoModifica {
        idEjecutivo
        nombre
      }
      documentacionContratos {
        idDocumentacionContrato
        documentacion {
          idDocumento
          nombreFichero
          descripcion
        }
      }
      embarques {
        idEmbarque
        numero
        fechaEntrega
        terminado
        cancelado
        porFirmar
        flete
        seguro
        idContrato
        idEjecutivo
        qtyCnt
        seguro
        financiamiento
        inspeccion
        otros
        c40
        c20
        actSci
      }
      facturaResumen {
        idFactura
      }
      suplementoEmbarques {
        idSuplementoEmbarques
      }
      suplementoResumen {
        idSuplementoResumen
      }
      suplementoClausulas {
        idSuplementoClausulas
      }
      pais {
        codpais
        pais
        nomb
      }
      companiaNaviera {
        id
        nombre
      }
      agenciaAseguradora {
        idAgenciaS
        nombre
        direccion
        telefono
      }
      incoterm {
        idIncoterm
        nombre
        abreviatura
      }
    }
  }
`;

export const selectOneContratoByIdBaseG = gql`
  query selectOneContratoByIdBaseG($id: Int!) {
    findContratosByIdBaseGeneral(id: $id) {
      idContrato
      idBasesGenerales
      idCMarco
      idMoneda
      idFormaEntrega
      idNegociacion
      realizadoPor
      firmadoPor
      modificadoPor
      lugarFirma
      consecutivo
      idIncoterm
      cancelado
      terminado
      modificado
      empresaSeguro
      idEmpresaNaviera
      lugarEntrega
      notas
      permitirEmbarquesParciales
      cantidadEp
      permitirEntregas
      permitirTrasbordos
      producto
      noEntregasParciales
      fechaElaboracion
      fechaInicial
      fechaFinal
      fechaFirma
      fechaRecepcion
      fechaArribo
      fechaPFirma
      financiamiento
      tasaMoneda
      fechaTasa
      pFin
      gastosLogisticos
      # contratoClausulas {
      #   idContratoClausulas
      #   noClausula
      #   contenido
      # }
      # basesGenerales {
      #   idBasesGenerales
      #   noContrato
      # }
      contratoMarco {
        idCMarco
        consecutivo
      }
      moneda {
        idMoneda
        moneda
        abreviatura
      }
      formaEntrega {
        idFormaEntrega
        formaEntrega
      }
      negociacionResumen {
        idNegociacion
        consecutivo
        noNegociacion
      }
      ejecutivoRealiza {
        idEjecutivo
        nombre
      }
      ejecutivoFirma {
        idEjecutivo
        nombre
      }
      ejecutivoModifica {
        idEjecutivo
        nombre
      }
      documentacionContratos {
        idDocumentacionContrato
        documentacion {
          idDocumento
          nombreFichero
          descripcion
        }
      }
      # embarques {
      #   idEmbarque
      #   numero
      #   fechaEntrega
      #   terminado
      #   cancelado
      #   porFirmar
      #   flete
      #   seguro
      #   idContrato
      #   idEjecutivo
      #   qtyCnt
      #   seguro
      #   financiamiento
      #   inspeccion
      #   otros
      #   c40
      #   c20
      #   actSci
      # }
      facturaResumen {
        idFactura
      }
      suplementoEmbarques {
        idSuplementoEmbarques
      }
      suplementoResumen {
        idSuplementoResumen
      }
      suplementoClausulas {
        idSuplementoClausulas
      }
      companiaNaviera {
        id
        nombre
      }
      incoterm {
        idIncoterm
        nombre
        abreviatura
      }
    }
  }
`;

//ContratoMarco
export const selectOneContratos = gql`
  query selectOneContratos($id: Int!) {
    findOneContratos(id: $id) {
      idCMarco
      fecha
      monto
      idProveedor
      consecutivo
      contratado
      pendiente
      proveedor {
        codigo
        compaIa
      }
    }
  }
`;

export const createContrato = gql`
  mutation createContratoMarco($createContratoInput: CreateContratoInput!) {
    createContrato(createContratoInput: $createContratoInput) {
      notas
    }
  }
`;

export const removeContrato = gql`
  mutation removeContrato($id: Int!) {
    removeContrato(id: $id) {
      notas
    }
  }
`;

export const removeSeveralContrato = gql`
  mutation removeSeveralContrato($id: [Int!]!) {
    removeSeveralContrato(id: $id) {
      notas
    }
  }
`;

//CMarco
export const selectOneContratoMarco = gql`
  query selectOneContratoMarco($id: Int!) {
    findOneContratoMarco(id: $id) {
      idCMarco
      fecha
      monto
      idProveedor
      consecutivo
      contratado
      pendiente
      proveedor {
        codigo
        compaIa
      }
    }
  }
`;
export const selectAllContratoMarco = gql`
  query selectAllContratoMarco {
    findAllContratoMarco {
      idCMarco
      fecha
      monto
      idProveedor
      consecutivo
      contratado
      pendiente
      noContratoMarco
      proveedor {
        codigo
        compaIa
      }
    }
  }
`;

export const createContratoMarco = gql`
  mutation createContratoMarco(
    $createContratoMarcoInput: CreateContratoMarcoInput!
  ) {
    createContratoMarco(createContratoMarcoInput: $createContratoMarcoInput) {
      consecutivo
    }
  }
`;

export const removeContratoMarco = gql`
  mutation removeContratoMarco($id: Int!) {
    removeContratoMarco(id: $id) {
      consecutivo
    }
  }
`;

export const removeSeveralContratoMarco = gql`
  mutation removeSeveralContratoMarco($id: [Int!]!) {
    removeSeveralContratoMarco(id: $id) {
      consecutivo
    }
  }
`;

// ProformaClausula
export const selectAllProformaClausulas = gql`
  query selectAllProformaClausulas {
    findAllProformaClausulas {
      idProformaClausula
      idTipoClausula
      orden
      proformas {
        idProforma
        nombreProfoma
      }
      clausula
      tiposDeClausulas {
        idTipoClausula
        nombre
      }
    }
  }
`;
export const selectAllProformaClausulasById = gql`
  query selectAllProformaClausulasById(
    $idTipoContrato: Int!
    $idIncoterm: Int!
  ) {
    findAllProformaClausulasById(
      idTipoContrato: $idTipoContrato
      idIncoterm: $idIncoterm
    ) {
      idProformaClausula
      idTipoClausula
      idTipoContrato
      idIncoterm
      orden
      clausula
      tiposDeClausulas {
        idTipoClausula
        nombre
      }
    }
  }
`;

export const createProformaClausula = gql`
  mutation createProformaClausula(
    $createProformaClausulaInput: CreateProformaClausulaInput!
  ) {
    createProformaClausula(
      createProformaClausulaInput: $createProformaClausulaInput
    ) {
      orden
    }
  }
`;
export const createSeveralProformaClausula = gql`
  mutation createSeveralProformaClausula(
    $createProformaClausulaInput: [CreateProformaClausulaInput!]!
  ) {
    createSeveralProformaClausula(
      createProformaClausulaInput: $createProformaClausulaInput
    ) {
      orden
    }
  }
`;

export const removeProformasClausulas = gql`
  mutation removeProformaClausula($id: Int!) {
    removeProformaClausula(id: $id) {
      orden
    }
  }
`;

export const removeSeveralProformasClausulas = gql`
  mutation removeProformaClausula($id: [Int!]!) {
    removeSeveralProformaClausula(id: $id) {
      orden
    }
  }
`;
