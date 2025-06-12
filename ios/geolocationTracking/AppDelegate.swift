import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import CodePush

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "geolocationTracking",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    CodePush.bundleURL()
#endif
  }

  override func extraModules(for bridge: RCTBridge) -> [RCTBridgeModule] {
    var extraModules = super.extraModules(for: bridge)
    let deploymentKey = ProcessInfo.processInfo.environment["CODEPUSH_KEY"] ?? (DEBUG ? "OAbIOKgE8wu0B2poYmknGnYKcIQa4ksvOXqog" : "iMENspEqqZdJLsxpxuJk0W2jISdm4ksvOXqog")
    extraModules.append(CodePush(deploymentKey: deploymentKey, bundleURL: bundleURL(),serverURL:"http://13.127.78.239:3000"))
    return extraModules
}
}
