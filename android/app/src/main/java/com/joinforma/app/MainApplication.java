package com.joinforma.app;

import android.app.Application;
import android.content.Context;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import com.facebook.react.ReactInstanceManager;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
// import com.reactnative.googlefit.GoogleFitPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.beefe.picker.PickerViewPackage;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import cx.evermeet.versioninfo.RNVersionInfoPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import com.microsoft.codepush.react.CodePush;
import com.mapbox.rctmgl.RCTMGLPackage;
import com.wix.interactable.Interactable; 
import com.plaid.PlaidPackage;
import com.facebook.react.bridge.JSIModulePackage;
import com.swmansion.reanimated.ReanimatedJSIModulePackage;
import com.bugsnag.android.Bugsnag;
import com.intercom.reactnative.IntercomModule;

import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for example:
      // packages.add(new SplashScreenReactPackage());
      packages.add(new Interactable());
      //  packages.add(new PlaidPackage());

      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
      
    }
    @Override
      protected JSIModulePackage getJSIModulePackage() {
        return new ReanimatedJSIModulePackage();
      }
    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Bugsnag.start(this);
    SoLoader.init(this, /* native exopackage */ false);
    IntercomModule.initialize(this, "android_sdk-673264f3d34fc95da5fca115729c46ddb6eb559c", "y2wzhv2s");
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }
  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.joinforma.app.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
