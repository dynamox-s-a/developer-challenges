//
//  Dependencies.swift
//  Pods
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

public enum Dependencies {

    public static func register<Value>(
        _ dependency: Value,
        as type: Value.Type = Value.self
    ) {
        DependencyContainer.shared.register(
            dependency,
            as: type
        )
    }

    public static func resolve<Value>(
        _ type: Value.Type = Value.self
    ) -> Value {
        DependencyContainer.shared.resolve(type)
    }

    public static func remove<Value>(
        _ type: Value.Type
    ) {
        DependencyContainer.shared.remove(type)
    }

    public static func contains<Value>(
        _ type: Value.Type
    ) -> Bool {
        DependencyContainer.shared.contains(type)
    }

    public static func reset() {
        DependencyContainer.shared.removeAll()
    }
}
