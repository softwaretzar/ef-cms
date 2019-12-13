resource "aws_ecr_repository" "image_repository" {
  name = "ef-cms-${var.environment}-${data.aws_region.current.name}"
}