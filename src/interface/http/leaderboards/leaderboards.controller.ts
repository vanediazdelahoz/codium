import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from "@nestjs/swagger";
import { LeaderboardService } from "@core/application/leaderboards/leaderboard.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

@ApiTags("leaderboards")
@ApiBearerAuth()
@Controller("leaderboards")
export class LeaderboardsController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get("challenges/:challengeId")
  @ApiOperation({ summary: "Get leaderboard for a specific challenge" })
  @ApiResponse({ status: 200, description: "Challenge leaderboard entries" })
  async getChallengeLeaderboard(
    @Param("challengeId") challengeId: string,
    @Query("limit") limit: string = "100",
    @CurrentUser() user: any,
  ) {
    return this.leaderboardService.getChallengeLeaderboard(challengeId, parseInt(limit));
  }

  @Get("courses/:courseId")
  @ApiOperation({ summary: "Get leaderboard for a specific course" })
  @ApiResponse({ status: 200, description: "Course leaderboard entries" })
  async getCourseLeaderboard(
    @Param("courseId") courseId: string,
    @Query("limit") limit: string = "100",
    @CurrentUser() user: any,
  ) {
    return this.leaderboardService.getCourseLeaderboard(courseId, parseInt(limit));
  }

  @Get("evaluations/:evaluationId")
  @ApiOperation({ summary: "Get leaderboard for a specific evaluation" })
  @ApiResponse({ status: 200, description: "Evaluation leaderboard entries" })
  async getEvaluationLeaderboard(
    @Param("evaluationId") evaluationId: string,
    @Query("limit") limit: string = "100",
    @CurrentUser() user: any,
  ) {
    return this.leaderboardService.getEvaluationLeaderboard(evaluationId, parseInt(limit));
  }
}
