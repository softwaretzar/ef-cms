resource "aws_ecr_repository" "image_repository" {
  name = "ef-cms-${data.aws_region.current.name}"
}