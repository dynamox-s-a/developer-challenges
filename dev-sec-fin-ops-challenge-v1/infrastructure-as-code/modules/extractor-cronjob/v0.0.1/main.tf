locals {
  module_version = reverse(split("/", abspath(path.module)))[0]
  module_name    = reverse(split("/", abspath(path.module)))[1]
}
