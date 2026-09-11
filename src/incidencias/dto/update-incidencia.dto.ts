import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateIncidenciaDto } from './create-incidencia.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoIncidencia } from '../entities/incidencia.entity';

export class UpdateIncidenciaDto extends PartialType(CreateIncidenciaDto) {
  @ApiProperty({ enum: EstadoIncidencia, required: false })
  @IsOptional()
  @IsEnum(EstadoIncidencia, { message: 'Estado inválido' })
  estado?: EstadoIncidencia;
}