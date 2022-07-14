export default class Contrato {
  idCMarco;
  fechaElaboracion;
  lugarFirma;
  firmadoPor;
  fechaFirma;
  idNegociacion;
  idMoneda;
  tasaMoneda;
  fechaTasa;
  idIncoterm;
  idEmpresaSeguro;
  idEmpresaNaviera;
  realizadoPor;
  producto;
  lugarEntrega;
  idFormaEntrega;
  fechaArribo;
  fechaRecepcion;
  fechaInicial;
  fechaFinal;
  noEntregasParciales;
  financiamiento;
  gastosLogisticos;
  permitirEmbarquesParciales;
  permitirTrasbordos;
  permitirEntregas;
  contratoClausulas;
  cancelado;
  idPais;
  idBasesGenerales;
  embarques;

  constructor(
    idCMarco,
    fechaElaboracion,
    lugarFirma,
    firmadoPor,
    fechaFirma,
    idNegociacion,
    idMoneda,
    tasaMoneda,
    fechaTasa,
    idIncoterm,
    idEmpresaSeguro,
    idEmpresaNaviera,
    realizadoPor,
    producto,
    lugarEntrega,
    idFormaEntrega,
    fechaArribo,
    fechaRecepcion,
    fechaInicial,
    fechaFinal,
    noEntregasParciales,
    financiamiento,
    gastosLogisticos,
    permitirEmbarquesParciales,
    permitirTrasbordos,
    permitirEntregas,
    contratoClausulas,
    cancelado,
    idPais,
    idBasesGenerales,
    embarques
  ) {
    this.idCMarco = idCMarco;
    this.fechaElaboracion = fechaElaboracion;
    this.lugarFirma = lugarFirma;
    this.firmadoPor = firmadoPor;
    this.fechaFirma = fechaFirma;
    this.idNegociacion = idNegociacion;
    this.idMoneda = idMoneda;
    this.tasaMoneda = tasaMoneda;
    this.fechaTasa = fechaTasa;
    this.idIncoterm = idIncoterm;
    this.idEmpresaSeguro = idEmpresaSeguro;
    this.idEmpresaNaviera = idEmpresaNaviera;
    this.realizadoPor = realizadoPor;
    this.producto = producto;
    this.lugarEntrega = lugarEntrega;
    this.idFormaEntrega = idFormaEntrega;
    this.fechaArribo = fechaArribo;
    this.fechaRecepcion = fechaRecepcion;
    this.fechaInicial = fechaInicial;
    this.fechaFinal = fechaFinal;
    this.noEntregasParciales = noEntregasParciales;
    this.financiamiento = financiamiento;
    this.gastosLogisticos = gastosLogisticos;
    this.permitirEmbarquesParciales = permitirEmbarquesParciales;
    this.permitirTrasbordos = permitirTrasbordos;
    this.permitirEntregas = permitirEntregas;
    this.contratoClausulas = contratoClausulas;
    this.cancelado = cancelado;
    this.idPais = idPais;
    this.idBasesGenerales = idBasesGenerales;
    this.embarques = embarques;
  }
}
