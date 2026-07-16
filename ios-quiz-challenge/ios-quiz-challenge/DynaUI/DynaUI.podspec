Pod::Spec.new do |spec|
  spec.name             = 'DynaUI'
  spec.version          = '0.1.0'
  spec.summary          = 'SwiftUI components for the DynaUI Design System.'
  spec.description      = 'A lightweight Design System built with reusable SwiftUI components.'

  spec.homepage         = 'https://github.com/kiyo92/DynaUI'
  spec.license          = { :type => 'MIT' }
  spec.author           = 'João Marcus'

  spec.source           = {
    :git => 'https://github.com/kiyo92/DynaUI.git',
    :tag => spec.version.to_s
  }

  spec.ios.deployment_target = '26.0'
  spec.swift_versions   = ['5.9', '6.0']

  spec.source_files     = 'Sources/**/*.swift'
  spec.frameworks       = 'SwiftUI'
end