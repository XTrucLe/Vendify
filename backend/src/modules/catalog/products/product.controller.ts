import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProductService } from './product.service';
import { CreateProductDto, GetProductsQueryDto, UpdateAvailabilityDto, UpdateProductDto } from './dtos/product.dto';
import { Public } from '@/common/decorators/public.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get()
  findAll(@Query() query: GetProductsQueryDto) {
    return this.productService.findAll(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.getById(id);
  }

  @Post()
  @Roles('owner', 'manager')
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Patch(':id')
  @Roles('owner', 'manager')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Patch(':id/availability')
  @Roles('owner', 'manager')
  updateAvailability(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAvailabilityDto) {
    return this.productService.updateAvailability(id, dto.isAvailable);
  }

  @Post(':id/image')
  @Roles('owner', 'manager')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadImage(@Param('id', ParseUUIDPipe) id: string, @UploadedFile() file: Express.Multer.File) {
    return this.productService.uploadImage(id, file);
  }

  @Delete(':id')
  @Roles('owner', 'manager')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.remove(id);
  }
}
