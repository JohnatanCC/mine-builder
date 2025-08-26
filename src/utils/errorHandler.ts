// src/utils/errorHandler.ts
import { toast } from "sonner";

type LogLevel = 'info' | 'warn' | 'error';

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

class ErrorHandler {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log estruturado com diferentes níveis
   */
  log(level: LogLevel, message: string, context?: ErrorContext, error?: Error) {
    const logData = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: this.isDevelopment ? error.stack : undefined,
        }
      })
    };

    // Console log em desenvolvimento
    if (this.isDevelopment) {
      console[level === 'info' ? 'log' : level]('[ErrorHandler]', logData);
    }

    // Em produção, enviar para serviço de logging (implementar futuramente)
    // this.sendToLoggingService(logData);
  }

  /**
   * Trata erros de undo/redo
   */
  handleUndoRedoError(error: Error, operation: 'undo' | 'redo') {
    this.log('error', `Falha na operação ${operation}`, {
      component: 'HistorySlice',
      action: operation
    }, error);

    toast.error(`Erro ao ${operation === 'undo' ? 'desfazer' : 'refazer'}: ${error.message}`);
  }

  /**
   * Trata erros de import/export
   */
  handleSerializationError(error: Error, operation: 'import' | 'export') {
    this.log('error', `Falha na serialização (${operation})`, {
      component: 'Serializer',
      action: operation
    }, error);

    const message = operation === 'import' 
      ? 'Falha ao importar mundo' 
      : 'Falha ao exportar mundo';
    
    toast.error(`${message}: ${error.message}`);
  }

  /**
   * Trata erros de material/textura
   */
  handleMaterialError(error: Error, blockType: string) {
    this.log('error', `Falha ao carregar material/textura`, {
      component: 'Materials',
      action: 'loadMaterial',
      metadata: { blockType }
    }, error);

    // Não mostrar toast para erros de material (podem ser muitos)
    // Apenas logar para debug
  }

  /**
   * Trata erros de áudio
   */
  handleAudioError(error: Error, trackId?: string) {
    this.log('warn', 'Falha no sistema de áudio', {
      component: 'AmbientAudio',
      action: 'playTrack',
      metadata: { trackId }
    }, error);

    toast.warning('Problema com áudio ambiente. Verifique as configurações.');
  }

  /**
   * Trata erros gerais da aplicação
   */
  handleGenericError(error: Error, context?: ErrorContext) {
    this.log('error', 'Erro não tratado na aplicação', context, error);
    
    if (this.isDevelopment) {
      toast.error(`Erro: ${error.message}`);
    } else {
      toast.error('Ocorreu um erro inesperado. Tente novamente.');
    }
  }

  /**
   * Registra warning sem interromper execução
   */
  warn(message: string, context?: ErrorContext) {
    this.log('warn', message, context);
  }

  /**
   * Registra informação
   */
  info(message: string, context?: ErrorContext) {
    this.log('info', message, context);
  }
}

export const errorHandler = new ErrorHandler();

// Error boundary helper
export class ErrorBoundary extends Error {
  context?: ErrorContext;
  originalError?: Error;
  
  constructor(
    message: string,
    context?: ErrorContext,
    originalError?: Error
  ) {
    super(message);
    this.name = 'ErrorBoundary';
    this.context = context;
    this.originalError = originalError;
  }
}

// Error boundary helper
export const withErrorBoundary = <T extends (...args: any[]) => any>(
  fn: T,
  context?: ErrorContext
): T => {
  return ((...args: any[]) => {
    try {
      return fn(...args);
    } catch (error) {
      errorHandler.handleGenericError(error as Error, context);
      throw new ErrorBoundary(
        'Função executou com erro',
        context,
        error as Error
      );
    }
  }) as T;
};
