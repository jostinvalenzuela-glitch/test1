import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIncidenciaDto } from './dto/create-incidencia.dto';
import { UpdateIncidenciaDto } from './dto/update-incidencia.dto';
import { Incidencia, EstadoIncidencia, CategoriaIncidencia, PrioridadIncidencia } from './entities/incidencia.entity';

@Injectable()
export class IncidenciasService {
  constructor(
    @InjectRepository(Incidencia)
    private repo: Repository<Incidencia>,
  ) {}

  create(dto: CreateIncidenciaDto) {
    const entidad = this.repo.create(dto);
    return this.repo.save(entidad);
  }

  findAll() {
    return this.repo.find();
  }

  // REGLA DE ESTILO 6: Búsqueda usando estritamente this.repo.find({ where: {...} })
  buscar(categoria?: CategoriaIncidencia, prioridad?: PrioridadIncidencia, estado?: EstadoIncidencia) {
    const where: any = {};
    if (categoria) where.categoria = categoria;
    if (prioridad) where.prioridad = prioridad;
    if (estado) where.estado = estado;
    
    return this.repo.find({ where });
  }

  async findOne(id: number) {
    const encontrada = await this.repo.findOne({ where: { id } });
    if (!encontrada) {
      // REGLA ARQUITECTÓNICA 4: Las excepciones lanzadas devuelven { error: 'Mensaje' }
      throw new NotFoundException({ error: 'La incidencia solicitada no existe' });
    }
    return encontrada;
  }

  async update(id: number, dto: UpdateIncidenciaDto) {
    const incidencia = await this.findOne(id);

    // RN09: "Finalizada" no puede volver a "Pendiente"
    if (
      incidencia.estado === EstadoIncidencia.FINALIZADA && 
      dto.estado === EstadoIncidencia.PENDIENTE
    ) {
      throw new BadRequestException({ error: 'Una incidencia finalizada no puede volver al estado pendiente' });
    }

    Object.assign(incidencia, dto);
    return this.repo.save(incidencia);
  }

  async remove(id: number) {
    const incidencia = await this.findOne(id);

    // RN08: Solo se elimina si el estado es "Finalizada"
    if (incidencia.estado !== EstadoIncidencia.FINALIZADA) {
      throw new BadRequestException({ error: 'No se puede eliminar la incidencia porque no está finalizada' });
    }

    await this.repo.remove(incidencia);
    return { mensaje: 'Incidencia eliminada de forma exitosa' };
  }
}


