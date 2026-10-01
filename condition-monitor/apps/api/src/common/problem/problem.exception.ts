import { HttpException } from '@nestjs/common';
import type { ProblemDetails } from './problem-details';

/**
 * An error the API raises on purpose, with a problem type of its own, such as
 * `urn:condition-monitor:error:conflict`. Services throw it; the filter writes it as is.
 */
export class ProblemException extends HttpException {
  constructor(readonly problem: ProblemDetails) {
    super(problem, problem.status);
  }
}
