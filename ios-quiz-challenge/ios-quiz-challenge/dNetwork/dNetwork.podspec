Pod::Spec.new do |spec|
  spec.name             = 'dNetwork'
  spec.module_name      = 'dNetwork'
  spec.version          = '0.1.0'
  spec.summary          = 'A lightweight and model-agnostic networking module.'
  spec.description      = <<-DESC
    A reusable networking module based on URLSession,
    async/await and generic Decodable responses.
  DESC

  spec.homepage         = 'https://github.com/kiyo92/dNetwork'
  spec.license          = { :type => 'MIT' }
  spec.author           = 'João Marcus'

  spec.source           = {
    :git => 'https://github.com/kiyo92/dNetwork.git',
    :tag => spec.version.to_s
  }

  spec.ios.deployment_target = '26.0'
  spec.swift_versions   = ['5.9', '6.0']

  spec.source_files     = 'Sources/**/*.swift'
  spec.frameworks       = 'Foundation'
end