Pod::Spec.new do |spec|
  spec.name             = 'dDependencies'
  spec.module_name      = 'dDependencies'
  spec.version          = '0.1.0'
  spec.summary          = 'Lightweight dependency injection for modular apps.'
  spec.description      = 'A small type-based dependency container with property wrapper support.'

  spec.homepage         = 'https://github.com/kiyo92/dDependencies'
  spec.license          = { :type => 'MIT' }
  spec.author           = 'João Marcus'

  spec.source           = {
    :git => 'https://github.com/kiyo92/dDependencies.git',
    :tag => spec.version.to_s
  }

  spec.ios.deployment_target = '26.0'
  spec.swift_versions   = ['5.9', '6.0']

  spec.source_files = 'Sources/**/*.swift'
end