import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum CategoriaIncidencia {
  HARDWARE = 'Hardware',
  SOFTWARE = 'Software',
  REDES = 'Redes',
  SEGURIDAD = 'Seguridad',
  SOPORTE_USUARIO = 'Soporte Usuario',
}

export enum PrioridadIncidencia {
  BAJA = 'Baja',
  MEDIA = 'Media',
  ALTA = 'Alta',
  CRITICA = 'Crítica',
}

export enum EstadoIncidencia {
  PENDIENTE = 'Pendiente',
  EN_PROGRESO = 'En Progreso',
  FINALIZADA = 'Finalizada',
}

@Entity('incidencias')
export class Incidencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  cliente: string;

  @Column({ type: 'enum', enum: CategoriaIncidencia })
  categoria: CategoriaIncidencia;

  @Column({ type: 'enum', enum: PrioridadIncidencia })
  prioridad: PrioridadIncidencia;

  @Column({ type: 'enum', enum: EstadoIncidencia, default: EstadoIncidencia.PENDIENTE })
  estado: EstadoIncidencia;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'date' })
  fechaSolicitud: Date;
}
