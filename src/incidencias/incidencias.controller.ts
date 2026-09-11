import { Controller, Get, Post, Body, Param, Delete, Put, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { IncidenciasService } from './incidencias.service';
import { CreateIncidenciaDto } from './dto/create-incidencia.dto';
import { UpdateIncidenciaDto } from './dto/update-incidencia.dto';
import { CategoriaIncidencia, EstadoIncidencia, PrioridadIncidencia } from './entities/incidencia.entity';

@ApiTags('incidencias')
@Controller('incidencias')
export class IncidenciasController {
  constructor(private readonly incidenciasService: IncidenciasService) {}

  @Post()
  @ApiOperation({ summary: 'Crea una nueva incidencia' })
  create(@Body() createIncidenciaDto: CreateIncidenciaDto) {
    return this.incidenciasService.create(createIncidenciaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtiene todas las incidencias' })
  findAll() {
    return this.incidenciasService.findAll();
  }

  // REGLA ARQUITECTÓNICA 3: La ruta 'buscar' DEBE ir antes que ':id'
  @Get('buscar')
  @ApiOperation({ summary: 'Busca incidencias aplicando filtros' })
  @ApiQuery({ name: 'categoria', required: false, enum: CategoriaIncidencia })
  @ApiQuery({ name: 'prioridad', required: false, enum: PrioridadIncidencia })
  @ApiQuery({ name: 'estado', required: false, enum: EstadoIncidencia })
  buscar(
    @Query('categoria') categoria?: CategoriaIncidencia,
    @Query('prioridad') prioridad?: PrioridadIncidencia,
    @Query('estado') estado?: EstadoIncidencia,
  ) {
    return this.incidenciasService.buscar(categoria, prioridad, estado);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene una incidencia por su identificador numérico' })
  // REGLA DE ESTILO 5: Uso estricto de ParseIntPipe
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.incidenciasService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualiza una incidencia existente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIncidenciaDto: UpdateIncidenciaDto,
  ) {
    return this.incidenciasService.update(id, updateIncidenciaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina una incidencia (Solo permitido si está Finalizada)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.incidenciasService.remove(id);
  }
}


