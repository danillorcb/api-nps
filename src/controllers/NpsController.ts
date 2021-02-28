import { getCustomRepository, Not, IsNull } from 'typeorm';
import { Request, Response } from 'express';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

/**
 * 1 2 3 4 5 6 7 8 9 10
 * 
 * Detratores => 0 - 6
 * Passivos => 7 - 8
 * Promotores => 9 - 10
 * 
 * Cálculo de NPS
 * (Número de promotores - Número de detratores) / (Número de respondentes) * 100
 */

 class NpsController {

  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull())
    });

    const detractor = surveysUsers.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
    ).length;

    const passive = surveysUsers.filter(
      (survey) => survey.value >= 7 && survey.value <= 8
    ).length;

    const promoters = surveysUsers.filter(
      (survey) => survey.value >= 9 && survey.value <= 10
    ).length;

    const totalAnswers = surveysUsers.length;

    const calculate = Number(
      (((promoters - detractor) / totalAnswers) * 100).toFixed(2)
    );

    return response.json({
      detractor,
      passive,
      promoters,
      totalAnswers,
      nps: calculate
    });
  }
}

export { NpsController };