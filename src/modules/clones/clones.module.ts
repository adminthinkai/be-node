import { Module } from '@nestjs/common';
import { ClonesService } from './clones.service';
import { ClonesController } from './clones.controller';
import { TokenModule } from '../token/token.module';
import { ValidationModule } from '../validation/validation.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TokenModule, ValidationModule, UserModule],
  controllers: [ClonesController],
  providers: [ClonesService],
  exports: [ClonesService],
})
export class ClonesModule {}
