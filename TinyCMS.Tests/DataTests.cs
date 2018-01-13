using System;
using System.Linq;
using TinyCMS.Data;
using TinyCMS.Data.Builder;
using TinyCMS.Data.Extensions;
using TinyCMS.Data.Nodes;
using TinyCMS.FileStorage;
using Xunit;

namespace TinyCMS.Tests
{
    public static class TestHelper
    {
        public static INode BuildBaseSite()
        {
            return new Site() { Id = "root" }
                .Add(new Page() { Name = "Blog", Id = "blog" }
                    .AddBlogPage("blog1")
                    .AddBlogPage("blog2"))
                .Add(new Page() { Name = "About", Id = "about" }
                    .AddBlogPage("blog3")
                     .Add(new TempObject()
                     {
                         Temp = new TempSub()
                         {
                             Sklep = 120,
                             Value = "apapapa"
                         }
                     })
                    .Add(new Text() { Value = "About page text" }));
        }
    }

    public class UnitTest1
    {
        [Fact]
        public void BuildSite()
        {
            // Arrange
            var site = TestHelper.BuildBaseSite();

            // Act
            site.AddBlogPage();

            // Assert
            Assert.Equal(site.Children.Count, 3);
        }

        [Fact]
        public void CreateBuilder()
        {
            // Arrange
            var site = TestHelper.BuildBaseSite();
            var container = new Container(site);

            // Act
            var aboutPage = container.GetById("about") as Page;

            // Assert
            Assert.Equal(aboutPage.Name, "About");
        }

        [Fact]
        public void TestRelations()
        {
            // Arrange
            var site = TestHelper.BuildBaseSite();
            var container = new Container(site);
            container.AddRelation(container.GetById("blog1"), container.GetById("blog2"));
            container.AddRelation(container.GetById("blog3"), container.GetById("blog1"));

            // Act
            var relations = container.GetRelationsById("blog1").ToList();

            // Assert
            Assert.True(relations.Any());
        }

        [Fact]
        public void TestStorage()
        {
            // Arrange
            var site = TestHelper.BuildBaseSite();
            var container = new Container(site);
            container.AddRelation(container.GetById("blog1"), container.GetById("blog2"));
            container.AddRelation(container.GetById("blog3"), container.GetById("blog1"));
            var store = new NodeFileStorage();

            // Act
            store.Store(container);
            var newContainer = store.Load();

            // Assert
            Assert.Equal(container.Nodes.Count(), newContainer.Nodes.Count());
        }

        [Fact]
        public void TestFactory()
        {
            // Arrange
            var factory = new NodeTypeFactory();

            // Act
            var newnode = factory.GetNew("text");

            // Assert
            Assert.Equal(newnode.GetType(), typeof(Text));
        }

    }
}
