//
//  Dependency.swift
//  Pods
//
//  Created by João Marcus Dionisio Araujo on 15/07/26.
//


@propertyWrapper
public struct Dependency<Value> {

    public init() {}

    public var wrappedValue: Value {
        Dependencies.resolve(Value.self)
    }
}