//
//  AnalyticsTacker.swift
//  dynamoxQuizChallenge
//
//  Created by Hyago Henrique on 22/02/26.
//

import Foundation
import FirebaseAnalytics

enum AnalyticsEvent {
    case questionAnswered(answer: String, user: String, questionId: String)
    case quizFinished(score: String, user: String)
    case quizStarted(String)
    
    var nameEvent: String {
        switch self {
        case .questionAnswered:
            return "question_answered"
        case .quizFinished:
            return "quiz_finished"
        case .quizStarted:
            return "quiz_started"
        }
    }

    var parameters: [String: String] {
        switch self {
        case .questionAnswered(let answer, let userName, let questionId):
            return ["answer": answer, "user": userName, "question": questionId]
        case .quizFinished(let score, let user):
            return ["score": score, "user": user]
        case .quizStarted(let user):
            return ["user": user]
        }
    }
}

final class AnalyticsTacker {
    static func log( _ log: AnalyticsEvent) {
        Analytics.logEvent(log.nameEvent, parameters: log.parameters)
    }
}
