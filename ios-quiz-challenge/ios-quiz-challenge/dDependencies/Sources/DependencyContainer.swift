//
//  DependencyContainer.swift
//  Pods
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//

import Foundation

public final class DependencyContainer: @unchecked Sendable {

    public static let shared = DependencyContainer()

    private var dependencies: [ObjectIdentifier: Any] = [:]
    private let lock = NSRecursiveLock()

    private init() {}

    public func register<Value>(
        _ dependency: Value,
        as type: Value.Type = Value.self
    ) {
        lock.lock()
        defer { lock.unlock() }

        dependencies[ObjectIdentifier(type)] = dependency
    }

    public func resolve<Value>(
        _ type: Value.Type = Value.self
    ) -> Value {
        lock.lock()
        defer { lock.unlock() }

        let identifier = ObjectIdentifier(type)

        guard let dependency = dependencies[identifier] else {
            fatalError(
                """
                Dependency<\(String(reflecting: type))> was not registered.

                Register it before resolving:

                Dependencies.register(
                    dependency,
                    as: \(String(reflecting: type)).self
                )
                """
            )
        }

        guard let typedDependency = dependency as? Value else {
            fatalError(
                """
                Dependency registered for \(String(reflecting: type))
                has an incompatible runtime type:
                \(String(reflecting: Swift.type(of: dependency)))
                """
            )
        }

        return typedDependency
    }

    public func remove<Value>(
        _ type: Value.Type
    ) {
        lock.lock()
        defer { lock.unlock() }

        dependencies.removeValue(
            forKey: ObjectIdentifier(type)
        )
    }

    public func removeAll() {
        lock.lock()
        defer { lock.unlock() }

        dependencies.removeAll()
    }

    public func contains<Value>(
        _ type: Value.Type
    ) -> Bool {
        lock.lock()
        defer { lock.unlock() }

        return dependencies[
            ObjectIdentifier(type)
        ] != nil
    }
}
