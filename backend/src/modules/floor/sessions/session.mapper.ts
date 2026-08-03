import { plainToInstance } from 'class-transformer';
import { TableSession } from './table-session.entity';
import { SessionResponseDto } from './session.dto';

export class SessionMapper {
  static toResponse(session: TableSession): SessionResponseDto {
    return plainToInstance(SessionResponseDto, session, { excludeExtraneousValues: true });
  }
  static toResponses(sessions: TableSession[]): SessionResponseDto[] {
    return sessions.map((session) => this.toResponse(session));
  }
}
