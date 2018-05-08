<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  
  <xsl:param name="linklist" select="'&lt;p&gt;&lt;em&gt;Nebyly nalezeny žádné odkazy.&lt;/em&gt;&lt;/p&gt;'"/>

  <xsl:template match="div[@id = 'content'][ancestor::body[contains(@class, 'agregator')]]">
    <div id="content" class="article"><div>
      <xsl:copy-of select="//ul[@class = 'docinfo nomultiple global']"/>
      <xsl:apply-templates select="*"/>
    </div></div>
  </xsl:template>
  
  <xsl:template match="//ul[@class = 'docinfo nomultiple global']"/>
  
  <xsl:template match="node()|@*">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>
