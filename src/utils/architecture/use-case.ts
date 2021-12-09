import { Observable } from 'rxjs';

/*
 * TODO Etudier l'option CQS car ni
 *  Export interface UseCase<TPayload extends unknown[], TResult>
 *  Export interface UseCase<TResult, TPayload extends unknown[] = []>
 *  ne resolvent l'implémentation de manière satisfaisante
 */
/**
 * Use cases hosts the entire implementation of the application's business logic.
 */
export interface UseCase<TPayload extends unknown[], TResult> {
  /**
   * Executes The logic implemented within the use case.
   *
   * @param payload The data required for use case execution.
   */
  execute$(...payload: TPayload): Observable<TResult>;
}
