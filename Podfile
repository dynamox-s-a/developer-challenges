# Uncomment the next line to define a global platform for your project
platform :ios, '16.0'

target 'DynamoxQuiz' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!
  
  pod 'Alamofire'

  # Pods for DynamoxQuiz
end

target 'DynamoxQuizTests' do
  inherit! :search_paths
  pod 'Alamofire'
end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '12.0'
      config.build_settings['SWIFT_SUPPRESS_WARNINGS'] = 'YES'
    end
  end
end
