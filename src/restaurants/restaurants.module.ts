import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import {
  CategoriesResolver,
  RestaurantsResolver,
} from './restaurants.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, CategoryRepository])],
  providers: [RestaurantsService, RestaurantsResolver, CategoriesResolver],
})
export class RestaurantsModule {}
