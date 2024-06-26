import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceEntity } from './resource.entity';
import { ResourceService } from './resource.service';

@Module({
  providers: [ResourceService],
  imports: [TypeOrmModule.forFeature([ResourceEntity])],
  exports: [TypeOrmModule, ResourceService],
})
export class ResourceModule {}
