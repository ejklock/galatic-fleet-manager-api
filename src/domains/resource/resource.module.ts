import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceEntity } from './resource.entity';
import { ResourceService } from './resource.service';
import { ValidResourceConstraint } from './validators/valid-resource.validator';

@Module({
  providers: [ResourceService, ValidResourceConstraint],
  imports: [TypeOrmModule.forFeature([ResourceEntity])],
  exports: [ResourceService],
})
export class ResourceModule {}
